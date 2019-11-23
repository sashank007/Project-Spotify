export function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function isMasterCheck() {
  let master = window.localStorage.getItem("master");
  let user = window.localStorage.getItem("currentUserId");

  if (master !== "" && master !== user) return false;
  return true;
}

export function isSameParty(id) {
  return id === window.localStorage.getItem("privateId");
}
