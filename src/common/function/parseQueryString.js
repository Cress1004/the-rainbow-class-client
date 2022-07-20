export function parsePageAndSearch(offset, search, filter) {
  return `offset=${offset}&search=${search || ""}&query=${
    filter ? encodeURI(filter) : ""
  }`;
}

export function parsePageSearchFilter(offset, search, filter) {
  return `offset=${offset}&search=${search || ""}&query=${
    filter ? encodeURI(filter) : ""
  }`;
}
