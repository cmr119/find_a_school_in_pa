class SchoolDistrict < ActiveRecord::Base
  scope :within_bounds, ->(sw_lat, sw_lng, ne_lat, ne_lng) { where("lat between ? and ?", sw_lat, ne_lat).where("lng between ? and ?", sw_lng, ne_lng) }
  def zip_code
    address.strip.slice(-5, 5)
  end
end
