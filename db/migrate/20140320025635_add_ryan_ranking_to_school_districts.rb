class AddRyanRankingToSchoolDistricts < ActiveRecord::Migration
  def change
    add_column :school_districts, :ryan_points, :float
  end
end
