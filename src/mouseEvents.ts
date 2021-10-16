export function onMouseClick() {
  console.log("click");

  // const desc = document.getElementById("desc");
  const about = document.getElementById("aboutMe");
  const projects = document.getElementById("projects");
  const contact = document.getElementById("contact");

  // if (desc!.classList.contains("hidden")) desc!.classList.remove("hidden");
  // else desc!.classList.add("hidden");

  if (about!.classList.contains("hidden")) about!.classList.remove("hidden");
  else about!.classList.add("hidden");

  if (projects!.classList.contains("hidden")) projects!.classList.remove("hidden");
  else projects!.classList.add("hidden");

  if (contact!.classList.contains("hidden")) contact!.classList.remove("hidden");
  else contact!.classList.add("hidden");
}
