import http from "@/services/http";

import type {
  CreatePollApiPayload,
  PollApiResponse,
} from "@/types/polls.api.type";

export const pollKeys = {
  all: ["polls"] as const,
  list: ["polls", "list"] as const,
};

export async function getPolls(): Promise<PollApiResponse[]> {
  const { data } = await http.get<PollApiResponse[]>("/polls");
  return data;
}

export async function createPoll(
  payload: CreatePollApiPayload,
): Promise<PollApiResponse> {
  const { data } = await http.post<PollApiResponse>("/polls", payload);
  return data;
}

export async function votePoll(
  pollId: string,
  optionId: string,
): Promise<PollApiResponse> {
  const { data } = await http.post<PollApiResponse>(`/polls/${pollId}/votes`, {
    optionId,
  });
  return data;
}

export async function withdrawVote(pollId: string): Promise<PollApiResponse> {
  const { data } = await http.delete<PollApiResponse>(`/polls/${pollId}/votes`);
  return data;
}

export async function closePoll(pollId: string): Promise<PollApiResponse> {
  const { data } = await http.post<PollApiResponse>(`/polls/${pollId}/close`);
  return data;
}
