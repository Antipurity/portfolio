export let projects = JSON.parse(`[
  {
    "name":"Text-sharing site",
    "urls":[
      "https://text-sharing-site.herokuapp.com/",
      "https://github.com/Antipurity/text-sharing-site"
    ],
    "images":[
      "text-sharing-site-1.jpg",
      "text-sharing-site-2.jpg",
      "text-sharing-site-3.jpg"
    ],
    "description":"A site where users share posts: pieces of Markdown content.\\n\\nUses Rust (a fast system programming language) and Firebase (a platform with a database offering), deployed on Heroku.\\n\\nThese pieces were not meant to go together."
  },
  {
    "name":"Image Modifier Project",
    "urls":[
      "https://image-modifier-project.herokuapp.com/",
      "https://github.com/Antipurity/image-modifier-project"
    ],
    "images":[
      "pristine-white-canvas.png"
    ],
    "description":"A platform for collaborative editing of a single image, pixel by pixel.\\n\\nUtilizes Julia, PostgreSQL, Docker, and JavaScript to deliver an intuitive and cohesive experience. Of editing one image.\\n\\n(The version deployed on Heroku often fails to start, because Julia is not a good choice for web servers, and [takes up too much RAM](https://discourse.julialang.org/t/large-idle-memory-usage/20368/5).)"
  },
  {
    "name":"2048",
    "urls":[
      "2048.html"
    ],
    "images":[
      "2048.png"
    ],
    "description":"A well-known game, recreated once more.\\n\\nUse arrow keys or arrow buttons to move all blocks, whereupon same-value blocks will combine into one. Last as long as you can; maximize the number that is plotted on the bottom-right.\\n\\nIt uses JavaScript and React. The latter is why its animations are somewhat broken."
  },
  {
    "name":"WebEnv",
    "urls":[
      null,
      "https://github.com/antipurity/webenv"
    ],
    "images":[
      "agent-5.gif",
      "noexplore-anim.gif",
      "orange-explore-blue-not.png",
      "agent-1.png",
      "agent-2.png",
      "agent-3.png",
      "agent-4.png"
    ],
    "description":"Online training environment for machine learning agents.\\n\\nIntended for training agents on the whole Web directly, without intermediaries such as [text](https://arxiv.org/abs/2101.00027) or [text-image pairs](https://github.com/openai/CLIP).\\n\\nWritten in JavaScript using Node.js (with an optional bridge to Python and other languages), this launches a browser (via Puppeteer), and collects observations and dispatches actions, so that the only thing that users have to worry about is how to go from observations to actions (the ML model)."
  },
  {
    "name":"Conceptual",
    "urls":[
      "https://antipurity.github.io/conceptual",
      "https://github.com/antipurity/conceptual"
    ],
    "images":[
      "conc2.png",
      "conc1.png",
      "conc3.png",
      "conc4.png",
      "conc5.png",
      "conc6.png",
      "conc7.png",
      "conc8.png",
      "conc9.png",
      "conc10.png",
      "conc11.png",
      "conc12.png",
      "conc13.png",
      "conc14.png",
      "conc15.png",
      "conc16.png"
    ],
    "description":"Programming language, runtime environment, ML research platform, etc. Includes many advanced uses of JavaScript and NodeJS.\\n\\nExperimenting with novel ways to create and interact with code. As such, the experience brought a lot of clarity and expertise in writing concise and crisp programs, even if humanity has its own preferred ways of doing things.\\n\\nThe purpose was to create a perfectly crisp framework of thought about everything, to pin down exactly what 'AGI' means and pin down its behaviors and implementation suggestions. This allows me to come up with creative solutions to any problems."
  }
]`)