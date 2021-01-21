import requests
import urllib
import pandas as pd
import sys
import json

from bs4 import BeautifulSoup


# Function to extract Product Title
def get_title(soup):

    try:
        # Outer Tag Object
        title = soup.find("span", attrs={"id": 'productTitle'})

        # Inner NavigatableString Object
        title_value = title.string

        # Title as a string value
        title_string = title_value.strip()

        # # Printing types of values for efficient understanding
        # print(type(title))
        # print(type(title_value))
        # print(type(title_string))
        # print()

    except AttributeError:
        title_string = ""

    return title_string

    # Function to extract Product Title


def get_image(soup, alt_title):

    image_string = ''

    try:
        # Outer Tag Object
        images = soup.find("img", attrs={"alt": alt_title})
        image_string = images.attrs['data-old-hires']

    except AttributeError:
        image_string = ""

    return image_string


# Function to extract Product Price
def get_price(soup):

    try:
        price = soup.find(
            "span", attrs={'id': 'priceblock_ourprice'}).string.strip()

    except AttributeError:
        price = ""

    return price

    # Function to extract Product Price


def get_original_price(soup):

    try:
        original_price = soup.find(
            "span", attrs={'class': 'priceBlockStrikePriceString'}).string.strip()

    except AttributeError:
        original_price = ""

    return original_price


# Function to extract Product Rating
def get_rating(soup):

    try:
        rating = soup.find(
            "i", attrs={'class': 'a-icon a-icon-star a-star-4-5'}).string.strip()

    except AttributeError:

        try:
            rating = soup.find(
                "span", attrs={'class': 'a-icon-alt'}).string.strip()
        except:
            rating = ""

    return rating

# Function to extract Number of User Reviews


def get_review_count(soup):
    try:
        review_count = soup.find(
            "span", attrs={'id': 'acrCustomerReviewText'}).string.strip()

    except AttributeError:
        review_count = ""

    return review_count


# Function to extract Availability Status
def get_availability(soup):
    try:
        available = soup.find("div", attrs={'id': 'availability'})
        available = available.find("span").string.strip()

    except AttributeError:
        available = "Not Available"

    return available


def amazon_scrape(keyword, HEADERS):

    # URL = "https://www.amazon.com/s?k=playstation+4&ref=nb_sb_noss_2"
    URL = 'https://www.amazon.com/s?' + urllib.parse.urlencode({'k': keyword})

    proxies = {
        'http': 'http://10.10.10.10:8000',
        'https': 'http://10.10.10.10:8000'
    }

    # HTTP Request
    webpage = requests.get(URL, headers=HEADERS)

    # Soup Object containing all data
    soup = BeautifulSoup(webpage.content, "lxml")

    # Fetch links as List of Tag Objects
    links = soup.find_all("a", attrs={'class': 'a-link-normal s-no-outline'})

    # Store the links
    links_list = []

    data_list = []

    # Loop for extracting links from Tag Objects
    for link in links:
        links_list.append(link.get('href'))

    # Loop for extracting product details from each link
    for link in links_list:

        new_webpage = requests.get(
            "https://www.amazon.com" + link, headers=HEADERS)

        new_soup = BeautifulSoup(new_webpage.content, "lxml")
        url = 'https://www.amazon.com' + link

        title = get_title(new_soup)
        # all_images = get_image(new_soup, title)
        rating = get_rating(new_soup)
        price = get_price(new_soup)
        original_price = get_original_price(new_soup)

        if (price != ""):
            data = {}
            data['title'] = title
            data['price'] = float(price[1:])
            data['rating'] = rating
            data['link'] = url

            if (original_price != ""):
                data['original_price'] = float(original_price[1:])
            else:
                data['original_price'] = ""

            data_list.append(data)

            # print("Product Title =", title)
            # # print("Product Image =", get_image(new_soup, title))
            # print("Product Price = $", price)
            # print("Product Price [Original]= $", get_original_price(new_soup))
            # print("Product Rating =", get_rating(new_soup))
            # print("Number of Product Reviews =", get_review_count(new_soup))
            # print("Availability =", get_availability(new_soup))
            # print("Link =", url)
            # print()
            # print()

    return data_list


if __name__ == '__main__':

    # Headers for request
    HEADERS = ({'User-Agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
                'Accept-Language': 'en-US'})

    keyword = str(sys.argv[1])
    # keyword = 'Playstation 4 Console'

    results = amazon_scrape(keyword, HEADERS)
    list_to_json_array = json.dumps(results)

    print(list_to_json_array)
    # print(results)
