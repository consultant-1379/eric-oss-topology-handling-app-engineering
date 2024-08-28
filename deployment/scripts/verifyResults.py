#
# COPYRIGHT Ericsson 2022
#
#
#
# The copyright to the computer program(s) herein is the property of
#
# Ericsson Inc. The programs may be used and/or copied only with written
#
# permission from Ericsson Inc. or in accordance with the terms and
#
# conditions stipulated in the agreement/contract under which the
#
# program(s) have been supplied.
#

import json
import sys
import os

TEST_RESULT_FILE = sys.argv[1]

print("Checking test result file: " + TEST_RESULT_FILE)

try:
    with open(TEST_RESULT_FILE, 'r') as f:
        input_json = json.load(f)

except IOError:
    print("Could not open file:", f)
    sys.exit(-1)

number_of_passed_tests = input_json['metrics']['checks']['values']['passes']
try:
    number_of_failed_checks = input_json['metrics']['checks']['values']['fails']
except:
    number_of_failed_checks = 0

print("Number of passed TCs: " + str(number_of_passed_tests))

if (number_of_failed_checks != 0) :
    print("Number of failed TC checks: " + str(number_of_failed_checks))
    sys.exit(number_of_failed_checks)
else:
    print("All TCs passed.")
    sys.exit(os.EX_OK)
