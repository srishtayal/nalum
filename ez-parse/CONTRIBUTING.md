## Details
The following are commands included in the Makefile:
- `make develop`: install the library's dependencies using `pip`
- `make build`: build the library using `setuptools`
- `make lint`: perform static analysis of this library with `black` and `flake8`
- `make format`: autoformat this library with `black`
- `make test`: run automated tests with `pytest`
- `make coverage`: run automated tests with `pytest` and collect coverage information (passes with coverage >50%)

## Contributions
Begin by forking this repository. After forking, run `make develop` to install the library's dependencies using `pip`.

After adding your changes, add tests for each of your changes in `Resume-Parser/test_all.py`. Then, run the following in order:
1) `make format` for easy autoformatting using `black`
2) `make lint` to perform static analysis using `black` and `flake8`
3) `make test` to ensure that all tests pass

If there aren't any formatting errors and all tests pass, feel free to open a PR with your changes.
