from setuptools import find_packages, setup

from arabic_pro import __version__

setup(
    name="arabic_pro",
    version=__version__,
    description="ترجمة عربية احترافية شاملة لـ Frappe و ERPNext",
    author="IdeaOrbit",
    author_email="info@ideaorbit.net",
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=[],
)
