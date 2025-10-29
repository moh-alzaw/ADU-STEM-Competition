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

    def __init__ (self, name, current_capacity, maximum_capacity, people_leaving, people_entering):
        self.name = name
        self.current_capacity = current_capacity
        self.maximum_capacity = maximum_capacity
        self.people_leaving = people_leaving
        self.people_entering = people_entering
        Exit.total_current_capacity += current_capacity



exit1_position = ()
exit2_position = ()
exit3_position = ()

class Room:
    def __init__(self, name, current_capacity, maximum_capacity):
        self.name = name
        self.current_capacity = current_capacity
        self.maximum_capacity = maximum_capacity


class Hazard:
    def __init__ (self, location, room, type, status): ## type is fire type
        self.location = location
        self.room = room
        self.type = type
        self.status = status

