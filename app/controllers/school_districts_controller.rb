class SchoolDistrictsController < ApplicationController
  def index
    gon.google_api_key = API_KEYS["google"]
  end

  def list
    render :json => SchoolDistrict.order("ryan_points desc").limit(50)
  end

  def map_markers
    school_districts = SchoolDistrict.select("id, name, rank_2013, statewide_rank, rank_2012, zillow_home_value_index, lat, lng, distance_to_pittsburgh, ryan_points")
    school_districts = school_districts.within_bounds(params[:swLat], params[:swLng], params[:neLat], params[:neLng]) if params[:searchByMap] == "true"

    render :json => school_districts.order("ryan_points desc").limit(50)
  end
end
