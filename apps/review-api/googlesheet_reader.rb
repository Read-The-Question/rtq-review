require "google/apis/sheets_v4"
require "googleauth"
require "googleauth/stores/file_token_store"
require "fileutils"

# require "logger"

# Google::Apis.logger = Logger.new($stdout)
# Google::Apis.logger.level = Logger::DEBUG

class GoogleSheetReader
  # OOB_URI = "urn:ietf:wg:oauth:2.0:oob".freeze
  OOB_URI = "http://localhost:8080/".freeze
  APPLICATION_NAME = "RTQ - Sync".freeze
  CREDENTIALS_PATH = "#{__dir__}/credentials.json".freeze

  # The file token.yaml stores the user's access and refresh tokens, and is
  # created automatically when the authorization flow completes for the first
  # time.
  TOKEN_PATH = "#{__dir__}/token.yaml".freeze
  SCOPE = Google::Apis::SheetsV4::AUTH_SPREADSHEETS

  def initialize
    # Initialize the API
    @service = Google::Apis::SheetsV4::SheetsService.new
    @service.client_options.application_name = APPLICATION_NAME
    # @service.client_options.log_http_requests = true
    # Google::Apis.logger = logger
    # @service.client_options.log_http_requests = true
    # @service.client_options.log_http_responses = true

    @service.client_options.open_timeout_sec = 600
    @service.client_options.read_timeout_sec = 600

    # @service.request_options = {
    #    max_retries: 5,
    #    base_interval: 1.0,
    #    max_interval: 10.0,
    #    multiplier: 2.0
    # }

    @service.authorization = authorize
  end

  #
  # Ensure valid credentials, either by restoring from the saved credentials
  # files or intitiating an OAuth2 authorization. If authorization is required,
  # the user's default browser will be launched to approve the request.
  #
  # @return [Google::Auth::UserRefreshCredentials] OAuth2 credentials
  def authorize
    client_id = Google::Auth::ClientId.from_file CREDENTIALS_PATH
    token_store = Google::Auth::Stores::FileTokenStore.new file: TOKEN_PATH
    authorizer = Google::Auth::UserAuthorizer.new client_id, SCOPE, token_store
    user_id = "default"
    credentials = authorizer.get_credentials user_id
    if credentials.nil?
      url = authorizer.get_authorization_url base_url: OOB_URI
      puts "Open the following URL in the browser and enter the " \
           "resulting code after authorization:\n" + url
      code = gets
      credentials = authorizer.get_and_store_credentials_from_code(
        user_id: user_id, code: code, base_url: OOB_URI
      )
    end
    credentials
  end

  def update_values(spreadsheet_id, range_name, values, value_input_option)
    puts "Updating data to Google Sheet: #{spreadsheet_id}, Range: #{range_name}"
    value_range_object = Google::Apis::SheetsV4::ValueRange.new(range:  range_name,
                                                                values: values)
    result = @service.update_spreadsheet_value(spreadsheet_id,
                                              range_name,
                                              value_range_object,
                                              value_input_option: value_input_option)
    puts "#{result.updated_cells} cells updated."
    result
  end

  def get_values(spreadsheet_id, range_name)
    begin
      puts "Fetching data from Google Sheet: #{spreadsheet_id}, Range: #{range_name}"
      response = @service.get_spreadsheet_values spreadsheet_id, range_name
      # chunk_range = "Questions - Reviews - PR!A2:F"
      # new_spreadsheet_id = "1AJLi0Aobag9ikF3WMuPNzNbkdRcHfBsVOUIlIFUlLBI"
      # response = @service.get_spreadsheet_values spreadsheet_id, chunk_range
      # response = @service.get_spreadsheet_values new_spreadsheet_id, range_name
      # response = @service.get_spreadsheet_values(spreadsheet_id, range_name)
      # new_spreadsheet_id = "1Ekh3PRzV4xcDhKIyHGoQLxSKChdjw8-gVMHQX0M_aVQ"
      # puts "Fetching data from Google Sheet: #{new_spreadsheet_id}, Range: #{range_name}"
      # response = @service.get_spreadsheet_values(spreadsheet_id, chunk_range)
      # response = @service.get_spreadsheet_values(new_spreadsheet_id, range_name)
    rescue => e
      puts "Error: #{e.class} - #{e.message}"
      raise
    end

    # response = @service.get_spreadsheet_values spreadsheet_id, range_name

    puts "No data found." if response.values.empty?
    response.values

    # response.values.each do |row|
    #   # Print columns A and E, which correspond to indices 0 and 4.
    #   # puts "#{row[0]}, #{row[4]}"
    #   row.each do |column|
    #     puts column
    #   end
    # end
  end
end
