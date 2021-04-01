# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.0.0-0](https://github.com/agrc/broadband/compare/v2.11.2...v3.0.0-0) (2021-04-01)


### Features

* add AOI modal and search bar in map ([5bd7d8d](https://github.com/agrc/broadband/commit/5bd7d8d7ccc9c5d41eb55164a980cf3706075a30)), closes [#122](https://github.com/agrc/broadband/issues/122)
* add simple cypress test ([91a779b](https://github.com/agrc/broadband/commit/91a779b9b5c40cb2c316ea7153b22f74728f6f28))
* another try at optimizing the data ([ab7b0b2](https://github.com/agrc/broadband/commit/ab7b0b25b33648ab6ea6d7c942c7692a4ea3bc90))


### Bug Fixes

* add missing mock for tests ([269943c](https://github.com/agrc/broadband/commit/269943c2ab3486ab039c6d422aca06b917d6fdd1))
* fix bower resolutions ([4958c1a](https://github.com/agrc/broadband/commit/4958c1a0d64de35d94200c95a25a3dd5242dcd8e))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# Legacy Changelog
<h2>2.11.2 <small>Sept 3, 2020</small></h2>
<ul>
    <li>Fixed broken geocoding request.</li>
</ul>
<h2>2.11.1 <small>Aug 4, 2020</small></h2>
<ul>
    <li>Update print proxy DNS.</li>
</ul>
<h2>2.11.0 <small>Jul 23, 2020</small></h2>
<ul>
    <li>Updated related to move to business.utah.gov/broadband (<a href="https://github.com/agrc/broadband/issues/115">#115</a>).</li>
</ul>
<h2>2.10.3 <small>Oct 3, 2019</small></h2>
<ul>
    <li>Update Broadband logo (<a href="https://github.com/agrc/broadband/issues/92">#92</a>).</li>
</ul>
<h2>2.10.2 <small>Sep 24, 2019</small></h2>
<ul>
    <li>Fix bug preventing base maps from showing up in printed PDF (<a href="https://github.com/agrc/broadband/issues/45">#45</a>).</li>
    <li>Fix bug preventing feedback submission when loading app via the "broadband.utah.gov" domain (<a href="https://github.com/agrc/broadband/issues/83">#83</a>).</li>
</ul>
<h2>2.10.1 <small>Feb 12, 2018</small></h2>
<ul>
    <li>Updated URL to SITLA's new Land Ownership service.</li>
</ul>
<h2>2.10.0 <small>Jun 19, 2017</small></h2>
<ul>
    <li>Added "Land Ownership" overlay to base map selector.</li>
</ul>
<h2>2.9.0 <small>Jun 19, 2017</small></h2>
<ul>
    <li>Added "Address Points" overlay to base map selector.</li>
</ul>
<h2>2.8.2 <small>Apr 25, 2017</small></h2>
<ul>
    <li>Added Google Analytics tracking for each point that is searched.</li>
</ul>
<h2>2.8.1 <small>Feb 16, 2017</small></h2>
<ul>
    <li>Reproject old UTM coordinates in URL parameters.</li>
</ul>
<h2>2.8.0 <small>Nov 17, 2016</small></h2>
<ul>
    <li>http -> https</li>
</ul>
<h2>2.7.5 <small>Aug 5, 2016</small></h2>
<ul>
    <li>Change "Map Gallery" link to "Other Maps and Data" (<a href='https://github.com/agrc/starch/issues/68'>#68</a>).</li>
    <li>Remove business-only providers from the providers filter (<a href='https://github.com/agrc/starch/issues/69'>#69</a>).</li>
    <li>Port nightly script to forklift pallet.</li>
</ul>
<h2>2.7.4 <small>May 9, 2016</small></h2>
<ul>
    <li>Switched minimum value on "Upload Speeds" slider from 0.256 to 0.2.</li>
</ul>
<h2>2.7.3 <small>Jan 30, 2016</small></h2>
<ul>
    <li>Updated legend swatches to match map (<a href='https://github.com/agrc/broadband/issues/66'>#66</a>).</li>
    <li>Changed default layer opacities to be 0.66 (wireline) and 0.33 (fixed and mobile) (<a href='https://github.com/agrc/broadband/issues/67'>#67</a>).</li>
    <li>Changed default speeds to be 3 Mbps download and 0.768 Mbps upload (<a href='https://github.com/agrc/broadband/issues/67'>#67</a>).</li>
</ul>
<h2>2.7.2 <small>Jan 29, 2016</small></h2>
<ul>
    <li>Renamed "Telcom Provider" to be "Telecom Service Area" (<a href='https://github.com/agrc/broadband/issues/59'>#59</a>).</li>
    <li>The coverage transparency slider is now split up into three separate sliders for each trans tech (<a href='https://github.com/agrc/broadband/issues/53'>#53</a>).</li>
    <li>Coverage layers now blend different colors if there is any transparency set (<a href='https://github.com/agrc/broadband/issues/53'>#53</a>).</li>
    <li>Updated the header with a title and other tweaks to make it better match locate.utah.gov (<a href='https://github.com/agrc/broadband/issues/51'>#51</a>).</li>
    <li>Simplified provider popup text (<a href='https://github.com/agrc/broadband/issues/57'>#57</a>).</li>
    <li>Added Populated Areas layer (<a href='https://github.com/agrc/broadband/issues/50'>#50</a>).</li>
    <li>Added attribute indexes to database (<a href='https://github.com/agrc/broadband/issues/43'>#43</a>).</li>
    <li>Fixed bug preventing the "Show Only the Following Provider(s)" checkbox from being selected after selecting one or more providers (<a href='https://github.com/agrc/broadband/issues/44'>#44</a>).</li>
    <li>Updated the navigation menu items to match the home page and removed the link on the logo (<a href='https://github.com/agrc/broadband/issues/48'>#48</a>).</li>
    <li>Right-justified the legend swatches (<a href='https://github.com/agrc/broadband/issues/49'>#49</a>).</li>
    <li>Updated the print map logo and URL's</li>
</ul>
<h2>2.7.0 <small>Jan 15, 2016</small></h2>
<ul>
    <li>Better normalization of values used to build charts in provider list.</li>
    <li>Added "Home" and "Map Gallery" links to navigation menu (<a href='https://github.com/agrc/broadband/issues/29'>#29</a>).</li>
    <li>Enable dragging and dropping of technology type checkboxes to control draw order</li>
    <li>Symbolize map based on three main technology types</li>
    <li>Fix bug causing a duplicate pushpin to be created when geocoding (<a href='https://github.com/agrc/broadband/issues/40'>#40</a>).</li>
    <li>Reclassify technology type checkboxes (<a href='https://github.com/agrc/broadband/issues/33'>#33</a>).</li>
    <li>Fix print service (<a href='https://github.com/agrc/broadband/issues/39'>#39</a>).</li>
    <li>Add "Last Updated" date to provider popup (<a href='https://github.com/agrc/broadband/issues/30'>#30</a>).</li>
    <li>Convert sliders to point to actual speed values (<a href='https://github.com/agrc/broadband/issues/34'>#34</a>).</li>
    <li>Added telcom provider link to bottom of results list (<a href='https://github.com/agrc/broadband/issues/31'>#31</a>).</li>
    <li>Fixed "Resellers" link (<a href='https://github.com/agrc/broadband/issues/41'>#41</a>).</li>
</ul>
<h2>2.5.0 <small>Jan 8, 2016</small></h2>
<ul>
    <li>More backend upgrades and clean up. Updated ESRI JS API to version 3.15. Much better set up for dealing with different paths in dev, stage and prod.</li>
    <li>Fixed the place search (<a href='https://github.com/agrc/broadband/issues/26'>#26</a>).</li>
    <li>Added "Consumer Broadband Map" title to logo (<a href='https://github.com/agrc/broadband/issues/32'>#32</a>).</li>
    <li>Removed filter checkboxes for "Provider Reported Market" (<a href='https://github.com/agrc/broadband/issues/35'>#35</a>).</li>
    <li>Updated navigation menus to match home page (<a href='https://github.com/agrc/broadband/issues/36'>#36</a>).</li>
    <li>Replaced old base map drop-down with new layer-selector widget and converted map to web mercator (<a href='https://github.com/agrc/broadband/issues/37'>#37</a>).</li>
</ul>
<h2>2.4.2 <small>Dec 29, 2015</small></h2>
<ul>
    <li>Backend upgrades and clean up.</li>
</ul>
<h2>2.4.1 <small>Feb 13, 2014</small></h2>
<ul>
    <li>Fixed layout bug on smaller screens (<a href="https://github.com/agrc/broadband/issues/22">#22</a>).</li>
</ul>
<h2>2.4.0 <small>Dec 4, 2014</small></h2>
<ul>
    <li>Upgraded to latest project boilerplate.</li>
    <li>Removed the preloader overlay (<a href="https://github.com/agrc/broadband/issues/2">#2</a>).</li>
    <li>Added "Print Map" link (<a href="https://github.com/agrc/broadband/issues/4">#4</a>).</li>
    <li>Fixed bug causing blank help popups in IE (<a href="https://github.com/agrc/broadband/issues/5">#5</a>).</li>
    <li>Fixed mix-align spinner on smaller screen layout (<a href="https://github.com/agrc/broadband/issues/6">#6</a>).</li>
    <li>Fixed bug causing incorrect URL parameters after pressing the full extent button (<a href="https://github.com/agrc/broadband/issues/7">#7</a>).</li>
    <li>New feedback widget (<a href="https://github.com/agrc/broadband/issues/8">#8</a>).</li>
    <li>Fixed bug causing the "Satellite Providers" link from toggling correctly (<a href="https://github.com/agrc/broadband/issues/9">#9</a>).</li>
    <li>The "Business only" checkbox now updates correctly based upon the providers selected in the "Select Providers" dialog (<a href="https://github.com/agrc/broadband/issues/10">#10</a>).</li>
    <li>Upgraded the script used to pull fresh data from SDE to the web application (<a href="https://github.com/agrc/broadband/issues/15">#15</a>).</li>
</ul>
<h2>2.3.4 <small>Apr 10, 2014</small></h2>
<ul>
    <li>Fixed initial definition query to prevent business only providers from showing up in search results even when the associated checkbox in the data filter is unchecked. Closes #29432.</li>
    <li>Fixed a bug that caused the speed text in the popup for a provider to not match the charts. Closes #31057.</li>
</ul>
<h2>2.3.2 <small>Jan 8, 2014</small></h2>
<ul>
    <li>Changed wording and definition queries for business/residential checkboxes. Closes #28885.</li>
</ul>
<h2>2.3.1 <small>Jan 7, 2014</small></h2>
<ul>
    <li>Changed "End User Category" to "Target Market".</li>
    <li>Changed "Residential" to "Consumer".</li>
</ul>
<h2>2.3.0 <small>Jan 6, 2014</small></h2>
<ul>
    <li>Added End User Category filter. Closes #24081.</li>
    <li>Fixed mis-aligned "Provider Results" header. Closes #24149.</li>
    <li>Added "Don't show me this again" checkbox to disclaimer dialog. Closes #24093.</li>
    <li>Moved "Other Maps and Resources" from the popup to the main window. Closes #24105.</li>
    <li>Added "Resellers" link. Closes #28647.</li>
</ul>
<h2>2.2.0 <small>Apr 3, 2013</small></h2>
<ul>
    <li>Added drop-down navigation menus to match the parent site. Closes <a href="https://redmine.dts.utah.gov/issues/23759">#23759</a>.</li>
</ul>
<h2>2.1.0 <small>Mar 11, 2013</small></h2>
<ul>
    <li>Fixed <a href="https://redmine.dts.utah.gov/issues/22615">#22615 - Extent coordinate are now rounded to the nearest whole number.</a></li>
    <li>Changed minDownSpeed & minUpSpeed URL parameters to reflect the speed domain codes instead of the slider values.</li>
</ul>
<h2>2.0.1 <small>Feb 25, 2013</small></h2>
<ul>
    <li>Fixed <a href="https://redmine.dts.utah.gov/issues/22893">#22893 - Fiber-only URL parameters.</a></li>
    <li>Created ChangeLog.html</li>
</ul>
