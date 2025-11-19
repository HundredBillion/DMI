module Api
  class CsvUploadsController < ApplicationController
    before_action :ensure_csv_file!

    def create
      parser = CsvParser.new(file: upload)
      result = parser.call

      render json: serialize(result)
    rescue StandardError => e
      Rails.logger.error("CSV upload failed: #{e.message}")
      render json: { errors: ["Unable to process CSV"] }, status: :internal_server_error
    end

    private

    def ensure_csv_file!
      file = upload
      is_csv = file.respond_to?(:content_type) &&
               (file.content_type.to_s.include?("csv") || File.extname(file.original_filename.to_s).downcase == ".csv")

      return if is_csv

      render json: { errors: ["A CSV file is required"] }, status: :unprocessable_content
    end

    def upload
      @upload ||= params[:file]
    end

    def serialize(result)
      {
        filename: result.filename,
        headers: result.headers,
        rows: result.rows,
        rowCount: result.row_count,
        errors: result.errors,
        truncated: result.truncated
      }
    end
  end
end