import axios from "axios";
export const httpClient = axios.create({
  baseURL: "https://medical-ai.gsenthilbalaji-cloud-learn.workers.dev",
});

export const getReadWriteUrl = async (fileId: string) => {
  return {
    uploadUrl: await getWriteUrl(fileId),
    downloadUrl: await getReadUrl(fileId),
  };
};

export const getReadUrl = async (fileId: string): Promise<string> => {
  const readileRes = await httpClient.get(`/download/${fileId}`);
  return readileRes.data;
};

export const getWriteUrl = async (fileId: string): Promise<string> => {
  const writeFileRes = await httpClient.post(`/upload/${fileId}`, { fileId });
  return writeFileRes.data.uploadURL;
};

export const extractTextFromImage = async (url: string): Promise<string> => {
  const response = await httpClient.post("/extract-image", { url });
  return response.data;
};

export const extractTextFromAudio = async (url: string): Promise<string> => {
  const response = await httpClient.post("/extract-audio", { url });
  return response.data;
};

export const summarizeText = async (fileId: string): Promise<any> => {
  const response = await httpClient.get(`/summarize-all-data/${fileId}`);
  return response.data;
};

export const vectorizeData = async (
  extractedText: string,
  id: string,
  userId: string
) => {
  const response = await httpClient.post(`/vectorize`, {
    extractedText,
    id,
    userId,
  });
  return response.data;
};

export const askMeAnythingApi = async (question: string, userId: string) => {
  const response = await httpClient.post(`/ask-me-anything`, {
    question,
    userId,
  });
  return response.data;
};
