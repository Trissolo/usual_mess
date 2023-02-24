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

def room_things_to_json(image, layer, room_id, atlas_id, walkable_area_marker = "_"):
    pdb.gimp_image_undo_group_start(image)
    pdb.gimp_context_push()
    
    #PUT YOUR CODE HERE:
    def showMessage(string):
        return pdb.gimp_message("\n" + string)
    
    #showMessage("Room Things here! :)")
    
    depthCategories = {
    "bg": -10, # BACKGROUND
    "rf": 0, # RIDICULOUSLYFARAWAY
    "ta": 1, # TRIGGERZONE
    "co": 2, # COVERED
    "ab": 3, # ALWAYSBACK
    "ds": 4, # DEEPSORTED
    "fg": 800 # FOREGROUND
    }

    # separator
    separator = ","

    #props:
    prop_x = "x"
    prop_y = "y"
    prop_frame = "frame"
    prop_depth = "depth"

    prop_width = "width"
    prop_height = "height"
    
    main_container = {}

    things = []
    main_container['things'] = things
    main_container['id'] = room_id
    main_container['atlas'] = atlas_id
    
    #showMessage(json.dumps(main_container))
    
    
    
    def test_names(curr_string, sep = separator):
        for allowed in depthCategories.keys():
            if curr_string.startswith(allowed + sep):
                return True
        return False
    
    def pre_test(ary = image.layers):
        for _, elem in enumerate(ary):
            if elem.visible and test_names(elem.name):
                return True
        return False
    
    def middle_down_origin(layer, depth, frame):
        x, y, width, height = get_rect(layer)
        container = {}
        container[prop_x] = x + int(width / 2)
        container[prop_y] = y + height
        container[prop_depth] = depth
        container[prop_frame] = frame
        return container

    def top_left_origin(layer, depth, frame):
        x, y = layer.offsets
        container = {}
        container[prop_x] = x
        container[prop_y] = y
        container[prop_depth] = depth
        container[prop_frame] = frame
        return container
    
    def trigger_area(layer, depth, frame):
        x, y, width, height = get_rect(layer)
        container = {}
        container[prop_x] = x
        container[prop_y] = y
        container[prop_width] = width
        container[prop_height] = height
        container[prop_depth] = depth
        container['name'] = frame
        return container
        
    def room_background(layer, depth, frame):
        main_container['background'] = frame
        
        

    #util
    def get_rect(layer):
        x, y = layer.offsets
        w = layer.width
        h = layer.height
        return (x, y, w, h)

    #test_result = "\nTest result: " + str(pre_test())
    #test_message = prop_x+separator+prop_y+separator+prop_frame+separator+prop_depth+str(len(image.layers))+"\n"+str(atlas_id)+separator+ str(room_id)
    #test as
    actions = {"bg": room_background, "rf": top_left_origin, "ta": trigger_area, "co": top_left_origin, "ab": top_left_origin, "ds": middle_down_origin, "fg": top_left_origin}
    idx = 0
    tlay = image.layers[idx]
    de, na = tlay.name.split(separator)
    

    for elem in image.layers:
        if elem.visible and test_names(elem.name):
            depth, name = (elem.name).split(separator)
            if depth == "bg":
                actions[depth](elem, depth, name)
            else:
                things.append(actions[depth](elem, depth, name))
    
    showMessage(json.dumps(main_container, sort_keys = True))
    
    #NO MORE CODE!
    pdb.gimp_context_pop()
    pdb.gimp_image_undo_group_end(image)
    pdb.gimp_displays_flush()
    #return

register(
    "mio_gimp_fu_room_things_to_json",                           
    "Generate a JSON containing the information obtained from the layers.",
    "Generate a JSON containing the information obtained from the layers.",
    "Trissolo",
    "Trissolo",
    "2023",
    "<Image>/Windows/TRIS/Generate Room Things JSON...", # <----= Menu path
    "RGB*, GRAY*", 
    [
    (PF_INT, "room_id", "Room ID", 0),
    (PF_INT, "atlas_id", "Atlas ID", 0)
    #(PF_COLOR, "oldcolor",  "Replace Color:",  (43,198,255)),
    #(PF_BOOL, "only_one",  "True or Not?",  True),
    #(PF_SPINNER, "x1", "x1:", 0, (0, 100, 0.5)),
    #(PF_FILE, "infilename", "Temp Filepath", "/Default/Path")#,
    #(PF_DIRNAME, "source_directory", "Source Directory", "")# for some reason, on my computer when i(Tin) use PF_DIRNAME the pythonw.exe would crash
    ],
    [],
    room_things_to_json)

main()
