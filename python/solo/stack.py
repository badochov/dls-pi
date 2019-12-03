import serial
import serial.tools.list_ports
is_running = False
value = "00000"
running = True
info="I"
lastByte="@"
porty = list(serial.tools.list_ports.comports())
stack = None
press_stack = []
for x in porty:
    print(x.description)
    if x.description == "USB2.0-Serial" or x.description.startswith("ttyACM"):
        stack=serial.Serial(x.device, 19200)
        print("wchodzi")
def record_audio():
    global value
    global is_running
    global info
    global lastByte
    global press_stack
    latest = '"I00000@0'
    while running:
        try:
            buffer = stack.readline().decode().rstrip('\r\n')
        except UnicodeDecodeError:
            buffer = 'I00000@0'
        if len(buffer) < 8:
            buffer = 'I00000@0'
        if buffer[0] != '"':
            buffer = '"' + buffer
        #print(buffer[6], latest[6])
        #print(buffer)
        try:
            if buffer[8] != latest[8] and buffer[8] != '0':
                press_stack.append(buffer[8])
                #print(press_stack)
        except IndexError:
            print(buffer, latest)
        if value[2:-2] == buffer[2:-2]:
            #print("twoj stary pijany")
            is_running = False
        else:
            is_running = True
        if buffer == "I00000@0":
            is_running = False
        value = buffer
        #print(buffer)
        latest = buffer
def get_state():
    global info
    return info
def get_last_byte():
    global lastByte
    return lastByte
def get_time_running():
    global is_running
    return is_running
def get_latest():
    global value
    try:
        return int(value[5:7]) + int(value[3:5])*100 + int(value[2:3])*6000
    except ValueError:
        return 0
def set_running(value):
    global running
    running = value
def get_press():
    global press_stack
    if len(press_stack) == 0:
        return False
    else:
        return press_stack.pop(0)
def clear_press():
    global press_stack
    press_stack = []
#record_audio()
