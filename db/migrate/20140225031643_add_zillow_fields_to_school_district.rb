class AddZillowFieldsToSchoolDistrict < ActiveRecord::Migration
  def change
    add_column :school_districts, :zillow_home_value_index, :integer
    add_column :school_districts, :zillow_median_home_value, :integer
    add_column :school_districts, :zillow_median_list_price, :integer
    add_column :school_districts, :zillow_median_sale_price, :integer
    add_column :school_districts, :zillow_property_tax,  :integer
  end
end
