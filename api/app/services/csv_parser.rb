require "csv"

class CsvParser
  Result = Struct.new(
    :filename,
    :headers,
    :rows,
    :row_count,
    :errors,
    :truncated,
    keyword_init: true
  )

  DEFAULT_OPTIONS = {
    col_sep: ",",
    row_sep: :auto
  }.freeze

  def initialize(file:, max_rows: nil)
    @file = file
    @max_rows = max_rows
  end

  def call
    headers = nil
    rows = []
    row_count = 0
    errors = []

    begin
      each_csv_row do |csv_row|
        headers ||= csv_row.headers
        rows << csv_row.to_h
        row_count += 1

        break if truncated?(row_count)
      end
    rescue CSV::MalformedCSVError => e
      errors << e.message
    end

    Result.new(
      filename: sanitized_filename,
      headers: headers || [],
      rows: rows,
      row_count: row_count,
      errors: errors,
      truncated: truncated?(row_count)
    )
  end

  private

  attr_reader :file, :max_rows

  def each_csv_row(&block)
    io = file.respond_to?(:tempfile) ? file.tempfile : file
    io.rewind if io.respond_to?(:rewind)

    CSV.new(io, **DEFAULT_OPTIONS.merge(headers: true)).each(&block)
  end

  def truncated?(row_count)
    max_rows.present? && row_count >= max_rows
  end

  def sanitized_filename
    File.basename(file.original_filename.to_s)
  end
end