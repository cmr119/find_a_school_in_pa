FindASchoolInPa::Application.routes.draw do
  root "school_districts#index"

  get "list" => "school_districts#list"

  post "map/markers" => "school_districts#map_markers"
end
