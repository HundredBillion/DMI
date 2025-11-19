require "rails_helper"

describe CsvParser do
  let(:file) do
    Rack::Test::UploadedFile.new(
      Rails.root.join("spec/fixtures/files/sample.csv"),
      "text/csv"
    )
  end

  describe "#call" do
    it "parses headers and rows" do
      result = described_class.new(file: file).call

      expect(result.filename).to eq("sample.csv")
      expect(result.headers).to contain_exactly("first_name", "last_name", "email")
      expect(result.row_count).to eq(2)
      expect(result.rows.size).to eq(2)
      expect(result.rows.first["first_name"]).to eq("Ada")
      expect(result.errors).to be_empty
      expect(result.truncated).to be(false)
    end

    it "respects max_rows limit" do
      result = described_class.new(file: file, max_rows: 1).call

      expect(result.row_count).to eq(1)
      expect(result.truncated).to be(true)
      expect(result.rows.size).to eq(1)
    end
  end
end
