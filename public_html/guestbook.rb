require 'socket'
require 'yaml/store'
require './guestbookentry.rb'

@server = TCPServer.new('localhost', 2345)

@guestbook = YAML::Store.new('guestbook.store')

# init guestbook

puts "listening on #{@server.inspect}"

@guestbook.transaction {
  if @guestbook['guests'].nil?
    STDERR.puts 'unitializing guestbook'
    @guestbook['guests'] = Array.new
  else
    STDERR.puts "guestbook already exists with #{@guestbook['guests'].count} entries"
  end
}

loop {
  socket = @server.accept
  STDERR.puts "new connection"
  socket.puts "welcome to ~audy's guestbook!"
  socket.print "Would you like to [s]ign or [c]heck the guestbook? "
  case socket.gets.strip
  when ?s
    socket.print "name: "
    name = socket.gets.strip
    socket.print "message: "
    message = socket.gets.strip
    socket.puts "Thanks, #{name}. Bye!"
    @guestbook.transaction {
      @guestbook['guests'] << GuestBookEntry.new(name, message, Time.now)
    }
    `make` # update index.html
    socket.close
  when ?c
    @guestbook.transaction {
      @guestbook['guests'].each do |entry|
        socket.puts entry.to_s
      end
    }
    socket.close
  end
}
