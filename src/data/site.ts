export const site = {
  name: "Candy AI Guide",
  domain: "candyai.bond",
  url: "https://candyai.bond",
  description: "Independent Candy AI review covering AI girlfriends, custom companions, chat, voice calls, images, video, pricing, tokens, privacy, safety, and alternatives.",
  author: "Candy AI Guide editorial team",
  officialUrl: "https://candy.ai/",
};
export const formatDate = (date: Date) => new Intl.DateTimeFormat("en-US", { year:"numeric", month:"long", day:"numeric", timeZone:"UTC" }).format(date);
export const toIsoDate = (date: Date) => date.toISOString().slice(0,10);
