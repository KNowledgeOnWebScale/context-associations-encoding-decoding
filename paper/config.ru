require 'rack'
require 'rack-livereload'
require 'thread'

class RebuildOnRequest
  def initialize(app)
    @app = app
    @mutex = Mutex.new
    @last_run = Time.at(0)
  end

  def call(env)
    path = env['PATH_INFO'].to_s
    if html_request?(path)
      @mutex.synchronize do
        now = Time.now
        if now - @last_run > 0.5
          system('bundle exec nanoc compile')
          @last_run = now
        end
      end
    end
    @app.call(env)
  end

  private

  def html_request?(path)
    path == '/' || path.end_with?('.html') || !File.extname(path).size.positive?
  end
end

class IndexRewriter
  def initialize app
    @app = app
  end

  def call env
    env["PATH_INFO"].gsub! /\/$/, '/index.html'
    @app.call env
  end
end

use RebuildOnRequest if ENV['NANOC_REBUILD_ON_REQUEST'] == '1'
use IndexRewriter
use Rack::LiveReload
run Rack::Files.new 'output'
