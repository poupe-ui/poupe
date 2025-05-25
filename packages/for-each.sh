#!/bin/sh

set -eu
BASE="$(dirname "$0")"

usage() {
	cat <<-EOT
	Usage: ./for-each.sh [-k package_dir] [--] [command [args...]]
	Executes a command in each specified package directory.
	Options:
	  -k package_dir  Execute command only in the specified package directory
	                  (can be used multiple times)
	  --              Signals the end of options
	Examples:
	  for-each.sh npm test
	  for-each.sh -k @poupe-tailwindcss npm run build
	EOT
}


die() {
	echo "$@" >&2
	exit 1
}

K=
while [ $# -gt 0 ]; do
	case "$1" in
	--)
 		shift
		;;
	-k)
		[ $# -gt 1 ] || die "-k option requires an argument"
 		K="$K $2"
 		shift 2
		;;
	-h)
		usage
		exit 0
		;;
	-*)
		echo "Unknown option: $1" >&2
		usage
		exit 1
		;;
	*)
 		break
		;;
	esac
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

		[ $i -eq 0 ] || echo

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
