class CreateSchoolDistricts < ActiveRecord::Migration
  def change
    create_table :school_districts do |t|
      t.string  :name
      t.string  :county
      t.integer :rank_2013
      t.integer :rank_2012
      t.integer :rank_11th
      t.integer :rank_8th
      t.integer :rank_7th
      t.integer :rank_6th
      t.integer :rank_5th
      t.integer :rank_4th
      t.integer :rank_3rd
      t.integer :statewide_rank
      t.integer :economic_disadvantaged_rank
      t.integer :overachiever_rank
      t.string  :address
      t.string  :phone
      t.string  :url
      t.float   :budget
      t.float   :tax_rate
      t.integer :enrollment
      t.float   :percentage_of_economically_disadvantaged_students
      t.float   :lat
      t.float   :lng

      t.timestamps
    end
  end
end
