class GuestBookEntry < Struct.new(:name, :message, :date)
  def to_s
   "on #{self.date}, #{self.name} wrote \"#{self.message}\""
  end
end
