#!/bin/sh

# Usage: ./for-each.sh [-k package_dir] [--] [command [args...]]
# Executes a command in each specified package directory.
# Options:
#   -k package_dir  Execute command only in the specified package directory
#                   (can be used multiple times)
#   --              Signals the end of options
# Examples:
#   for-each.sh npm test
#   for-each.sh -k @poupe-tailwindcss npm run build

set -eu
BASE="$(dirname "$0")"

die() {
	echo "$@" >&2
	exit 1
}

K=
while [ $# -gt 0 ]; do
 	if [ "x$1" = "x--" ]; then
 		shift
 		break
 	elif [ "x$1" = "x-k" ]; then
		[ $# -gt 1 ] || die "-k option requires an argument"
 		K="$K $2"
 		shift 2
 	else
 		break
 	fi
 done

if [ -z "$K" ]; then
	K=" \
	@poupe-css \
	@poupe-theme-builder \
	@poupe-tailwindcss \
	@poupe-vue \
	@poupe-nuxt \
	"
fi

i=0
for d0 in $K; do
	d="$BASE/$d0"
	if [ -d "$d/" ]; then
		cd "$d"

		if [ $i -gt 0 ]; then
			echo
		fi

		cat <<-EOT
		#
		# $PWD
		#
		EOT

		[ $# -eq 0 ] || "$@"

		: $(( i=i+1 ))


		cd - > /dev/null
	fi
done
