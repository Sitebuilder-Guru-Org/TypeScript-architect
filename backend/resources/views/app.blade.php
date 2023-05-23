@extends('common::framework')

@section('angular-styles')
    {{--angular styles begin--}}
		<link rel="stylesheet" href="client/styles.75a40fd807045a3c8755.css" media="print" onload="this.media=&apos;all&apos;">
		<link rel="stylesheet" href="client/styles.75a40fd807045a3c8755.css">
	{{--angular styles end--}}
@endsection

@section('angular-scripts')
    {{--angular scripts begin--}}
		<script>
        setTimeout(function() {
            var spinner = document.querySelector('.global-spinner');
            if (spinner) spinner.style.display = 'flex';
        }, 50);
    </script>
		<script src="client/runtime.f88bc76f55fb6d36c303.js" defer></script>
		<script src="client/polyfills.e85190139dc8f6acda60.js" defer></script>
		<script src="client/main.05d9404da6510d19fc5d.js" defer></script>
	{{--angular scripts end--}}
@endsection
