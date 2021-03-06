# config valid only for Capistrano 3.1
lock '3.1.0'

set :application, 'whereshouldtheryanslive'
set :deploy_user, 'ec2-user'
set :scm, :git
set :repo_url, 'git@github.com:cmr119/find_a_school_in_pa.git'
set :deploy_to, '/var/www/whereshouldtheryanslive'
set :keep_releases, 5
set :linked_files, %w{config/database.yml config/api_keys.yml}
set :linked_dirs, %w{log}#%w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}

# Default branch is :master
# ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }

# Default deploy_to directory is /var/www/my_app


# Default value for :scm is :git

# Default value for :format is :pretty
# set :format, :pretty

# Default value for :log_level is :debug
# set :log_level, :debug

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# set :linked_files, %w{config/database.yml}

# Default value for linked_dirs is []
# set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5

namespace :deploy do

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      # Your restart mechanism here, for example:
      execute "touch #{release_path}/tmp/restart.txt"
    end
  end

  after :publishing, :restart

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
      # within release_path do
      #   execute :rake, 'cache:clear'
      # end
    end
  end

  task :updated do
    on roles(:web) do
      execute "ln -s #{release_path}/vendor/assets/stylesheets/pa_extjs/resources/ext-theme-neptune/images/* #{release_path}/public/images/"
    end
  end
end
