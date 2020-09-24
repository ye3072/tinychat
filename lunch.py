#-*- coding: utf-8 -*-
from bs4 import BeautifulSoup as bs
from pprint import pprint
import requests
import sys

html = requests.get('http://www.ddu.ac.kr/cop/bbs/selectBoardList.do?menuId=MNU_0000000000000182&bbsId=BBSMSTR_000000000015&searchCateList=BBSCTG_0000000000039')

soup = bs(html.text, 'html.parser')
board = soup.find('table', {'class': 'bbs_list1'})
lastOne = board.findAll('tr')[1]
link = lastOne.find('td', {'class': 'tit'}).find('a')
html = requests.get('http://www.ddu.ac.kr' + link['href'])

f = open('lunch.html', 'w', encoding='UTF-8')
f.write('''
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>식단표</title>
<style>
@import url(https://fonts.googleapis.com/css?family=Open+Sans:400,600);
*, *:before, *:after { margin: 0; padding: 0; box-sizing: border-box;}
html { background: #105469; font-family: 'Open Sans', sans-serif;}
table { background: #012B39; border-radius: 0.25em; border-collapse: collapse; margin: 1em;}
tr:first-child td{ border-bottom: 1px solid #364043; color: #E2B842; font-size: 0.85em; font-weight: 600; padding: 0.5em 1em; text-align: left;}
td { color: #fff; font-weight: 400; padding: 0.65em 1em;}
tr { transition: background 0.25s ease;}
.column-hover {	background: #014055;}
</style>
</head>
<body>
	<table>
''')
soup = bs(html.text, 'html.parser')
table = soup.find('table')
rows = table.findAll('tr')
for i, row in enumerate(rows[5:16]):
	cols = row.findAll('td')
	column = ''
	f.write('<tr>')
	count = 1
	for j, col in enumerate(cols):
		if j < 1 and i < 3:
			continue
		column += col.text + '\t'
		f.write('<td class="column%s">%s</td>' % (count, col.text))
		count+=1
	# print(column)
	f.write('</tr>')
	# f.write(column + '\n')

f.write('''
	</table>
	<script src="//code.jquery.com/jquery-1.11.1.js"></script>
	<script>
	$('td').mouseenter((e) => {	var cls = $(e.target).attr('class'); $('.'+cls).addClass('column-hover');});
	$('td').mouseout((e) => { var cls = $(e.target).attr('class').split(' ')[0]; $('.'+cls).removeClass('column-hover'); });
	</script>
</body>
</html>
''')
f.close()