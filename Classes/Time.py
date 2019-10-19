class Time:
    SECOND = 100
    MINUTE = 60 * SECOND
    HOUR = 60 * MINUTE

    def __init__(self, time: int | str, raw=True):
        """
        Constructs Time either from raw time or centiseconds

        :param time:
        """

        if raw:
            self.centi = Time.raw_time_to_centi(time)
        else:
            self.centi = time

    def __str__(self) -> str:
        """
        It returns its display form when it get converted to string

        :return:
        """

        return self.display_form()

    def __int__(self) -> int:
        """
        It returns its millis when converted to int
        :return:
        """

        return self.centi

    def difference_from_timestamp(self, timestamp: float) -> float:
        """
        Calculates difference in centiseconds between it and timestamp

        :param timestamp:
        :return:
        """

        return self - round(timestamp * 100)

    def difference_from_time_instance(self, time: __class__):
        """
        Calculates difference in centiseconds between it and another Time instance

        :param time:
        :return:
        """

        return self - time

    def display_form(self) -> str:
        """
        Returns form of self suited for display

        :param self:
        :return:
        """

        hours, minutes, seconds, centi_secs = Time.centi_seconds_to_hours_minutes_seconds_millis(self.centi)

        display_time = ""
        was_non_zero_before = False
        if hours > 0:
            display_time += str(hours) + ":"
            was_non_zero_before = True

        if minutes > 0:
            if was_non_zero_before:
                minutes_str = Time.ten(minutes)
            else:
                minutes_str = str(minutes)
                was_non_zero_before = True
            display_time += minutes_str + ":"

        if was_non_zero_before:
            seconds_str = Time.ten(seconds)
        else:
            seconds_str = str(seconds)
        display_time += seconds_str + "."

        display_time += Time.ten(centi_secs)

        return display_time

    # static methods

    @staticmethod
    def raw_time_to_centi(raw_time: str) -> int:
        """
        Returns centiseconds from raw time taken from arduino

        :param raw_time:
        :return:
        """

        time = int(raw_time[2:7])
        minutes = time // (Time.SECOND * 100)

        time = (time % (Time.SECOND * 100)) + minutes * Time.MINUTE
        return time

    @staticmethod
    def centi_seconds_to_hours_minutes_seconds_millis(centi: int) -> (int, int, int, int):
        """
        Return hours, minutes. seconds, centi_seconds representation of time given in centiseconds

        :param centi:
        :return:
        """

        hours = centi // Time.HOUR
        minutes = (centi % Time.HOUR) // Time.MINUTE
        seconds = (centi % Time.MINUTE) // Time.SECOND
        milli_secs = centi % Time.SECOND

        return hours, minutes, seconds, milli_secs

    @staticmethod
    def ten(number: int) -> str:
        """
        Returns string from of number.
        If the number is smaller than 10 return 0 concatenated with number

        :param number:
        :return :
        """

        string_form = str(number)
        return string_form if number >= 0 else "0" + string_form
