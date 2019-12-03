import pygame
from Classes.Display import Display


class Text:
    FONT_NAME = 'Sans'
    FONT = pygame.font.SysFont(FONT_NAME, 100)

    def __init__(self, display: Display):
        """
        Initializes Text intance

        :param display:
        """

        self.Display = display
        pygame.font.init()

    def print(self, text, coords: (float, float)) -> None:
        """
        Prints text on given coords

        :param text:
        :param coords:
        :return:
        """

        self.screen.blit(text, coords)

    def get_text_data(self, string, color):
        """
        Returns pygame text instance and size of it in pixels

        :param string:
        :param color:
        :return:
        """

        text = self.FONT.render(string, False, color)
        text_size = self.FONT.size(string)

        return text, text_size

    def print_string_as_secondary_text(self, string: str, main_string: str, color: (int, int, int) = (0, 0, 0)) -> None:
        """
        Prints string as secondary text (under the main one)

        :param string:
        :param main_string:
        :param color:
        :return:
        """

        text, text_size, display_size = self.get_text_data(string, color)
        display_size = self.display.size

        main_text_size = self.FONT.size(main_string)

        x = display_size[0] / 2 - text_size[0] / 2
        y = display_size[1] / 2 - text_size[1] / 2 + main_text_size[1] * 2

        self.print(text, (x, y))

    def print_string_as_main_text(self, string: str, color: (int, int, int) = (0, 0, 0)) -> None:
        """
        Prints string as main text (in the middle of the screen)

        :param string:
        :param main_string:
        :param color:
        :return:
        """

        text, text_size = self.get_text_data(string, color)
        display_size = self.display.size

        x = display_size[0] / 2 - text_size[0] / 2
        y = display_size[1] / 2 - text_size[1] / 2

        self.print(text, (x, y))
