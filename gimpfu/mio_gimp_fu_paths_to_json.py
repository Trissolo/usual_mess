#!/usr/bin/env python

# Sample Shell Rel 1
# Created by Trissolo
# Comments directed to http://gimpchat.com or http://gimpscripts.com
#
# License: GPLv3
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY# without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# To view a copy of the GNU General Public License
# visit: http://www.gnu.org/licenses/gpl.html
#
#
# ------------
#| Change Log |
# ------------
# Rel 1: Initial release.
import math
import string
#import Image
#from array import array
from gimpfu import *

import json

def visible_vectors_to_json(image, layer, room_id, sub_id, glob_container = [], walkable_area_marker = "_"):
    pdb.gimp_image_undo_group_start(image)
    pdb.gimp_context_push()
    
    #PUT YOUR CODE HERE
    def pre_test(vectors, marker):
        for idx, vector in enumerate(vectors):
            if vector.name.startswith(marker) and vector.visible:
                return True
        
        return False


    def showMessage(string):
        return pdb.gimp_message("\n" + string)
    
    def bezier_points_to_string(vector):
        x_and_y_values = []
        bezier_list = vector.strokes[0].points[0]
        
        for i in range(0, len(bezier_list), 6):
            x_and_y_values.append(int(bezier_list[i]))
            x_and_y_values.append(int(bezier_list[i + 1]))
        
        return ' '.join(map(str, x_and_y_values))


    def add_record(container, room, sub):
        container.append({"coords": [], "room": room, "sub": sub})

    if pre_test(image.vectors, walkable_area_marker):
        for idx, vector in enumerate(image.vectors):
            if vector.visible:
                if vector.name.startswith(walkable_area_marker):
                    add_record(glob_container, room_id, sub_id)
                    sub_id += 1
                
                
                container = glob_container[len(glob_container) - 1]["coords"]
                container.append(bezier_points_to_string(vector))
        
        showMessage(json.dumps(glob_container))#, indent= 2))
    else:
        showMessage("Aborted! :(\nAt least one visible path is required, with a name starting with '{}'".format(walkable_area_marker))

    #NO MORE CODE!
    pdb.gimp_context_pop()
    pdb.gimp_image_undo_group_end(image)
    pdb.gimp_displays_flush()
    #return

register(
    "mio_gimp_fu_paths_to_json",                           
    "Generate a JSON containing the coordinates of the points of each visible path.",
    "Generate a JSON containing the coordinates of the points of each visible path.",
    "Trissolo",
    "Trissolo",
    "2023",
    "<Image>/Windows/TRIS/Generate JSON (Paths Points)...", # <----= Menu path
    "RGB*, GRAY*", 
    [
    (PF_INT, "room_id", "Current Room", 0),
    (PF_INT, "sub_id", "Room floor ID", 0)
    #(PF_COLOR, "oldcolor",  "Replace Color:",  (43,198,255)),
    #(PF_BOOL, "only_one",  "True or Not?",  True),
    #(PF_SPINNER, "x1", "x1:", 0, (0, 100, 0.5)),
    #(PF_FILE, "infilename", "Temp Filepath", "/Default/Path")#,
    #(PF_DIRNAME, "source_directory", "Source Directory", "")# for some reason, on my computer when i(Tin) use PF_DIRNAME the pythonw.exe would crash
    ],
    [],
    visible_vectors_to_json)

main()
