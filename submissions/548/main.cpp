//{{{
#include <bits/stdc++.h>
using namespace std;
#define rep(...) repN((__VA_ARGS__,rep3,rep2,loop,~))(__VA_ARGS__)
#define loop(n) rep2(_loop_,n)
#define rep2(i,n) rep3(i,0,n)
#define rep3(i,begin,end) for(int i=(int)(begin),i##_end=(int)(end);i<i##_end;++i)
#define repN(a) repX a
#define repX(a0,a1,a2,x,...) x
typedef long long ll;
const int MOD = 1e9+7;
//}}}

bool f(string str, char c)
{
	str.push_back(c);
	int a[26] = {0};
	rep(i, 14){
		a[str[i] - 'a']++;
	}
	int mx = a[0];
	int mn = a[0];
	rep(i, 1, 13){
		mx = max(mx, a[i]);
		mn = min(mn, a[i]);
	}
	return (mx == 2 && mn == 1);
}

int main(){
	string s;
	cin >> s;
	int count = 0;
	for(auto c: "abcdefghijklm"){
		if(f(s, c)){
			count++;
			cout << c << endl;
		}

	}
	if(count == 0){
		puts("Impossible");
	}
	return 0;
}
