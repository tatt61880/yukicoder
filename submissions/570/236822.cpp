//{{{
#include <bits/stdc++.h>
using namespace std;
//}}}

int main(void){
	map<int, char> mp;
	int x;
	cin >> x; mp[x] = 'A';
	cin >> x; mp[x] = 'B';
	cin >> x; mp[x] = 'C';
	for(auto it = mp.rbegin(); it != mp.rend(); ++it){
		cout << it->second << endl;
	}
	return 0;
}
