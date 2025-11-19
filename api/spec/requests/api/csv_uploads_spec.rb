require "rails_helper"

describe "CSV uploads API", type: :request do
  describe "POST /api/csv_uploads" do
    let(:endpoint) { "/api/csv_uploads" }

    it "returns parsed CSV data" do
      file = fixture_file_upload("sample.csv", "text/csv")

      post endpoint, params: { file: file }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["headers"]).to include("first_name", "last_name", "email")
      expect(json["rows"].size).to eq(2)
      expect(json["rowCount"]).to eq(2)
    end

    it "rejects missing file" do
      post endpoint

      expect(response).to have_http_status(:unprocessable_content)
      json = JSON.parse(response.body)
      expect(json["errors"]).to include("A CSV file is required")
    end

    it "rejects non-CSV uploads" do
      file = fixture_file_upload("sample.txt", "text/plain")

      post endpoint, params: { file: file }

      expect(response).to have_http_status(:unprocessable_content)
    end
  end
end
