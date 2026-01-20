const BASE_URL = 'https://insect.kindwise.com/api/v1';
const API_KEY = process.env.INSECT_ID_API_KEY;

export interface IdentificationResponse {
  access_token: string;
}

export interface InsectResult {
  id: string;
  name: string;
  commonNames: string[];
  probability: number;
  classificationIndex?: number;
  url?: string;
  description?: string;
  image?: string;
  images?: Array<{
    url: string;
    license_name?: string;
    license_url?: string;
  }>;
}

export interface IdentificationDetails {
  results: InsectResult[];
  access_token: string;
  custom_id?: string;
}

export interface UsageInfo {
  remaining_credit: number;
  total_credit: number;
}

// Step 1: Upload image and get access_token
export async function uploadInsectImage(
  file: File,
  options?: {
    latitude?: number;
    longitude?: number;
    datetime?: string;
  }
): Promise<IdentificationResponse> {
  const formData = new FormData();
  formData.append('images', file);

  if (options?.latitude !== undefined) {
    formData.append('latitude', options.latitude.toString());
  }
  if (options?.longitude !== undefined) {
    formData.append('longitude', options.longitude.toString());
  }
  if (options?.datetime) {
    formData.append('datetime', options.datetime);
  }

  const response = await fetch(`${BASE_URL}/identification`, {
    method: 'POST',
    headers: {
      'Api-Key': API_KEY || '',
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response.json();
}

// Step 2: Get identification results
export async function getIdentificationResults(
  accessToken: string,
  details?: string
): Promise<IdentificationDetails> {
  let url = `${BASE_URL}/identification/${accessToken}`;

  if (details) {
    url += `?details=${details}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Api-Key': API_KEY || '',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get results: ${response.statusText}`);
  }

  return response.json();
}

// Step 3: Delete identification record
export async function deleteIdentification(accessToken: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/identification/${accessToken}`, {
    method: 'DELETE',
    headers: {
      'Api-Key': API_KEY || '',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete: ${response.statusText}`);
  }
}

// Step 4: Get usage info
export async function getUsageInfo(): Promise<UsageInfo> {
  const response = await fetch(`${BASE_URL}/usage_info`, {
    method: 'GET',
    headers: {
      'Api-Key': API_KEY || '',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get usage info: ${response.statusText}`);
  }

  return response.json();
}

// Step 5: Search insects by name
export async function searchInsectByName(searchTerm: string): Promise<InsectResult[]> {
  const response = await fetch(
    `${BASE_URL}/kb/insect/name_search?q=${encodeURIComponent(searchTerm)}`,
    {
      method: 'GET',
      headers: {
        'Api-Key': API_KEY || '',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  return response.json();
}
