"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchGreeting } from "@/lib/test/api";

export default function Greeting() {
  const { data, isLoading } = useQuery({
    queryKey: ["greeting"],
    queryFn: fetchGreeting,
  });

  if (isLoading) return <p>Loading...</p>;
  return <p>{data?.message}</p>;
}
