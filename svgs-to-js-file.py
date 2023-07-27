import sys
import os

svgsTemplate:str = """
const svgs = {{
  {items}
}}
"""

svgItemTemplate:str = """
    "{baseFilename}": "{svg_content}",
"""

def to_file(folder:str, outFilename:str):
  items:str = ''

  if folder.endswith("/"):
    folder = folder[:-1]
  dir_list = os.listdir(folder)
  for svg in dir_list: #type: str
    with open(folder+"/"+svg, "r") as f:
      s:str = f.read().strip().replace('"', "'")
      items += svgItemTemplate.format(baseFilename=svg[:-4], svg_content=s)
  
  with open(outFilename, "w") as f:
    f.write(svgsTemplate.format(items=items))


if __name__ == '__main__':
  # py svgs-to-js-file.py svgs svgs.js
  to_file(*sys.argv[1:])