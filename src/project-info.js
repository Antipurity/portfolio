export let projects = JSON.parse(`[
  {
    "name":"Image Modifier Project",
    "urls":[
      "https://image-modifier-project.herokuapp.com/",
      "https://github.com/Antipurity/image-modifier-project"
    ],
    "images":[
      "pristine-white-canvas.png"
    ],
    "description":"A platform for collaborative editing of a single image, pixel by pixel.\\n\\nUtilizes Julia, PostgreSQL, Docker, and JavaScript to deliver an intuitive and cohesive experience. Of editing one image.\\n\\n(The version deployed on Heroku often fails to start, because Julia is a poor choice for web servers, and [takes up too much RAM](https://discourse.julialang.org/t/large-idle-memory-usage/20368/5).)"
  },
  {
    "name":"2048",
    "urls":[
      "/dist/2048.html"
    ],
    "images":[
      null,
      "TODO"
    ],
    "description":"TODO"
  },
  {
    "name":"WebEnv",
    "urls":[
      "https://github.com/Antipurity/webenv"
    ],
    "images":[
      null,
      "TODO"
    ],
    "description":"TODO"
  },
  {
    "name":"Conceptual",
    "urls":[
      "https://antipurity.github.io/conceptual",
      "https://github.com/antipurity/conceptual"
    ],
    "images":[
      null,
      "TODO: Open it (https://Antipurity.github.io/conceptual), and make some screenshots. And put them here, or, uh, somewhere in images."
    ],
    "description":"TODO: How do we describe it, in Markdown format?"
  }
]`)