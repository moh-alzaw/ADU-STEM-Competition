import eel
import os
import shutil
import atexit

chromeDataDirectory = None

eel.init("web")

# Eel Core System
class CoreSystem:
    def exitCleanup():
        if (os.path.exists(chromeDataDirectory)):
            shutil.rmtree(chromeDataDirectory)
            os.makedirs(chromeDataDirectory)

    def startUp():
        userdataDirectory = os.path.join(os.getcwd(), 'chrome-instance-user-data')
        global chromeDataDirectory
        chromeDataDirectory = userdataDirectory
        if not (os.path.exists(userdataDirectory)):
            os.makedirs(userdataDirectory)
        eel.start("index.html", size=(800, 700), cmdline_args=["--disable-extensions", '--user-data-dir={}'.format(userdataDirectory)])

atexit.register(CoreSystem.exitCleanup)
CoreSystem.startUp()

#start here

class Exit:
    total_current_capacity = 0
    net_movement = 0

    def __init__ (self, name,position, current_capacity, maximum_capacity, people_leaving, people_entering):
        self.name = name
        self.position = position
        self.maximum_capacity = maximum_capacity
        self.people_leaving = people_leaving
        self.people_entering = people_entering
        self.current_capacity = 0
        Exit.net_movement = people_entering - people_leaving
        Exit.total_current_capacity += current_capacity

    def update_capacity(self):
        self.current_capacity += self.people_leaving + self.people_entering

height = 10
width = 20
exit1 = Exit("Exit1", (0, height/2), 0, 10, 0, 0)
exit2 = Exit("Exit2", (width, height/2),0, 10, 0, 0)
exit3 = Exit("Exit3", (width/2, height),0, 10, 0, 0)

class Room:
    total_current_capacity = 0
    net_movement = 0

    def __init__(self, name, current_capacity, maximum_capacity, people_leaving, people_entering):
        self.name = name
        self.current_capacity = current_capacity
        self.maximum_capacity = maximum_capacity
        self.people_leaving = people_leaving
        self.people_entering = people_entering
        self.current_capacity = people_leaving + people_entering
        Room.net_movement = people_entering - people_leaving
        Room.total_current_capacity += current_capacity

main_hall = Room("Mail Hall", 0, 10, 0, 0)

class Person:
    def __init__(self, position, room, state):
        self.position = position
        self.room = room
        self.inside = True
        self.state = state
        self.distance_from_nearest_exit#leaving or entering
# accessibility thing
    def leave(self, exit_name):
        self.inside = False
        Room.total_current_capacity -= 1
        exit_name.people_leaving += 1
    def enter(self, exit_name):
        self.inside = True
        Room.total_current_capacity += 1
        exit_name.people_entering += 1


class Hazard:
    #size is an x and y list
    def __init__ (self, location, room, hazard_type, status, size): ## type is fire type
        self.location = location
        self.size = size
        self.room = room
        self.type = hazard_type
        self.status = status