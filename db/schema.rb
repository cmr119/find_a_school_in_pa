# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140320025635) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "school_districts", force: true do |t|
    t.string   "name"
    t.string   "county"
    t.integer  "rank_2013"
    t.integer  "rank_2012"
    t.integer  "rank_11th"
    t.integer  "rank_8th"
    t.integer  "rank_7th"
    t.integer  "rank_6th"
    t.integer  "rank_5th"
    t.integer  "rank_4th"
    t.integer  "rank_3rd"
    t.integer  "statewide_rank"
    t.integer  "economic_disadvantaged_rank"
    t.integer  "overachiever_rank"
    t.string   "address"
    t.string   "phone"
    t.string   "url"
    t.float    "budget"
    t.float    "tax_rate"
    t.integer  "enrollment"
    t.float    "percentage_of_economically_disadvantaged_students"
    t.float    "lat"
    t.float    "lng"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "zillow_home_value_index"
    t.integer  "zillow_median_home_value"
    t.integer  "zillow_median_list_price"
    t.integer  "zillow_median_sale_price"
    t.integer  "zillow_property_tax"
    t.integer  "distance_to_pittsburgh"
    t.float    "ryan_points"
  end

end
