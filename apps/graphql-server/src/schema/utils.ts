export const likeEscapeString = (str: string): string => {
  return str.replace(/[%_\\]/g, '\\$&');
}
