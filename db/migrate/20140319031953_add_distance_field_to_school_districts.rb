class AddDistanceFieldToSchoolDistricts < ActiveRecord::Migration
  def change
    add_column :school_districts, :distance_to_pittsburgh, :integer
  end
end
