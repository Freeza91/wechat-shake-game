require 'mina/git'

# ter_mode 这个要设置，不然在 mac 下输密码有问题
set :term_mode, nil
set :domain, 'test.geeklab.cc'
set :deploy_to, '/home/deploy/wechats'
set :repository, 'git@github.com:Freeza91/wechat-shake-game.git'
set :branch, 'master'

set :shared_paths, ['config/application.js', 'log', 'node_modules', 'tmp']

set :user, 'deploy'
set :port, '9527'
set :forward_agent, true

task :environment do
end

task :setup => :environment do
  queue! %[mkdir -p "#{deploy_to}/shared/log"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/log"]

  queue! %[mkdir -p "#{deploy_to}/shared/config"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/config"]

  queue! "mkdir -p #{deploy_to}/shared/node_modules"
  queue! "chmod g+rx,u+rwx #{deploy_to}/shared/node_modules"

  queue! %[touch "#{deploy_to}/shared/config/application.js"]

end

desc "Deploys the current version to the server."
task :deploy => :environment do
  deploy do
    invoke :'git:clone'
    invoke :'deploy:link_shared_paths'
    queue!  "npm install"
    # 静态资源的编译可以放到package.json里的{scripts:{install:'xxxxx'}}
    to :launch do
      queue! "pm2 startOrRestart ecosystem.json5 --env production"
    end
  end
end