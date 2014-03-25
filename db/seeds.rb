# scrape for the school district rankings
begin
  SchoolDistrict.delete_all

  sd_ranks = %i(rank_2013 rank_2012 name rank_11th rank_8th rank_7th rank_6th rank_5th rank_4th rank_3rd)
  sd_details = { :statewide_rank => "Statewide rank", :economic_disadvantaged_rank => "Economic disadvantaged rank",
                 :overachiever_rank => "Overachiever rank", :address => "Address",
                 :phone => "Phone", :url => "Website", :budget => "District budget",
                 :tax_rate => "Tax millage rate", :enrollment => "Enrollment",
                 :percentage_of_economically_disadvantaged_students => "Percent of students who are economically disadvantaged" }

  agent = Mechanize.new
  page = agent.get("http://b3.caspio.com/dp.asp?AppKey=036b100066200d6020ed4ab4aab8")

  loop do
    break if page.blank?

    rows = page.search("//table[@class='cbResultSetTable']/tr")
    rows.each do |row|
      next if row.attributes["class"].try(:text) == "cbResultSetTableHeader"

      values = {}

      sd_ranks.each_with_index do |rank, index|
        values[rank] = row.at_xpath("td[#{index + 1}]").text.strip
      end

      details_page = agent.get("http://b3.caspio.com/#{row.at_xpath("td[3]/a")["href"]}")
      details = details_page.search("//table[@class='cbFormTable']/tr/td[@class='cbHTMLBlockContainer']").collect { |detail| detail.text.strip }

      sd_details.each do |field, string|
        value = details.find { |detail| detail.start_with?(string) }.split(": ").last
        values[field] = value.start_with?("$") ? value.delete("$").delete(",") : value
      end

      school_district = SchoolDistrict.new(values)
      school_district.save!
    end

    page = page.link_with(:text => "Next").try(:click)
  end

  Rails.logger.info "Created #{SchoolDistrict.count} school district records"
rescue Exception => ex
  Rails.logger.error "An error occurred scraping the school district data: #{ex}"
end


# clean up record for K-8 only school
SchoolDistrict.where(:rank_2013 => 999).destroy_all


# scrape for each school's county
begin
  agent = Mechanize.new
  page = agent.get("http://b3.caspio.com/dp.asp?AppKey=036b10003ec5be0a033e48eaac99")
  success = 0
  errors = 0

  loop do
    break if page.blank?

    rows = page.search("//table[@class='cbResultSetTable']/tr")
    rows.each do |row|
      next if row.attributes["class"].try(:text) == "cbResultSetTableHeader"

      school_district = SchoolDistrict.where("name = ?", row.at_xpath("td[3]").text.strip).take
      if school_district.present?
        school_district.county = row.at_xpath("td[4]").text.strip
        school_district.save!
        success += 1
      else
        Rails.logger.info("Could not find a school district with name = #{row.at_xpath("td[3]").text.strip}")
        errors += 1
      end
    end

    page = page.link_with(:text => "Next").present? ? page.link_with(:text => "Next").click :
        page.link_with(:text => "Next10").try(:click)
  end

  Rails.logger.info "County lookups: #{success} successful, #{errors} unsuccessful"
rescue Exception => ex
  Rails.logger.error "An error occurred scraping a school's county: #{ex}"
end


# geocode each school district's address
success = 0
errors = 0
SchoolDistrict.all.each do |school_district|
  begin
    response = HTTParty.get("http://maps.googleapis.com/maps/api/geocode/json?address=#{URI.escape(school_district.address)}&sensor=false")
    if (response.parsed_response["status"] == "OK")
      school_district.lat = response.parsed_response["results"].first["geometry"]["location"]["lat"]
      school_district.lng = response.parsed_response["results"].first["geometry"]["location"]["lng"]
      school_district.save!
      success += 1
    else
      raise "Error response from Google API"
    end
  rescue Exception => ex
    Rails.logger.error "An error occurred requesting #{school_district.name}'s geo coordinates: #{ex}"
    errors += 1
  end
  sleep 1 # required to avoid rate limit errors
end
Rails.logger.info "Geocode requests: #{success} successful, #{errors} unsuccessful"

# get the distance to Pittsburgh
success = 0
errors = 0
SchoolDistrict.all.each do |school_district|
  begin
    response = HTTParty.get(URI.escape("https://maps.googleapis.com/maps/api/distancematrix/json?key=#{API_KEYS["google"]}&origins=#{school_district.lat},#{school_district.lng}&destinations=Pittsburgh, PA&sensor=false"))
    if (response.parsed_response["status"] == "OK")
      school_district.distance_to_pittsburgh = response.parsed_response["rows"].first["elements"].first["duration"]["value"] / 60
      school_district.save!
      success += 1
    else
      raise "Error response from Google API"
    end
  rescue Exception => ex
    Rails.logger.error "An error occurred calculating #{school_district.name}'s distance to Pittsburgh, PA: #{ex}"
    errors += 1
  end
end
Rails.logger.info "Distance to Pittsburgh requests: #{success} successful, #{errors} unsuccessful"


# Zillow data
success = 0
errors = 0
SchoolDistrict.all.each do |school_district|
  begin
    response = HTTParty.get("http://www.zillow.com/webservice/GetDemographics.htm?zws-id=#{API_KEYS["zwsid"]}&zip=#{school_district.zip_code}")
    xml = Nokogiri::XML(response.body)

    if (xml.xpath("//message/code").try(:text) == "0")
      nodes = xml.xpath("//attribute")

      values = { "Zillow Home Value Index" => :zillow_home_value_index=, "Median Single Family Home Value" => :zillow_median_home_value=,
                 "Median List Price" => :zillow_median_list_price=, "Median Sale Price" => :zillow_median_sale_price=,
                 "Property Tax" => :zillow_property_tax= }

      nodes.each do |node|
        name = node.at(".//name").text
        value = node.at(".//values/zip").try(:text)
        if (values.keys.include?(name))
          school_district.send(values[name], value)
        end
      end

      school_district.save!
      success += 1
    else
      raise "An error occurred using the Zillow API: #{xml.xpath("//message/text").try(:text)}"
    end
  rescue Exception => ex
    Rails.logger.error "An error occurred requesting the Zillow data for #{school_district.name}: #{ex}"
    errors += 1
  end
end
Rails.logger.info("Zillow requests: #{success} successful, #{errors} unsuccessful")


# Ryan Points
success = 0
errors = 0
max_ranking = SchoolDistrict.maximum(:rank_2013) / 2
max_zillow = SchoolDistrict.maximum(:zillow_home_value_index)
max_distance = SchoolDistrict.maximum(:distance_to_pittsburgh)
SchoolDistrict.all.each do |school_district|
  begin
    ranking_points = (max_ranking - ((school_district.rank_2013 - 1) / 2))
    zillow_points = if (school_district.zillow_home_value_index.present?)
                      (max_zillow - school_district.zillow_home_value_index) / 10000
                    else
                      0
                    end
    distance_points = (max_distance - school_district.distance_to_pittsburgh) / 10

    school_district.ryan_points = ranking_points + zillow_points + distance_points
    school_district.save!
    success += 1
  rescue Exception => ex
    Rails.logger.error "An error occurred calculating the Ryan Points for #{school_district.name}: #{ex}"
    errors += 1
  end
end
Rails.logger.info "Ryan Points: #{success} successful, #{errors} unsuccessful"