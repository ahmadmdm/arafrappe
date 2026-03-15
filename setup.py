from setuptools import setup, find_packages

with open("requirements.txt") as f:
    install_requires = f.read().strip().split("\n")

setup(
    name="arabic_pro",
    version="1.0.0",
    description="ترجمة عربية احترافية لـ Frappe و ERPNext",
    author="IdeaOrbit",
    author_email="info@ideaorbit.net",
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=install_requires,
)
