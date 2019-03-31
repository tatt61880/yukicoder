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

int main(){
	string s;
	cin >> s;
	const char *east = strstr(s.c_str(), "OOO");
	const char *west = strstr(s.c_str(), "XXX");
	if(!east && !west){
		puts("NA");
	}else{
		bool ans;
		if(!east) ans = false;
		else if(!west) ans = true;
		else ans = east < west;
		puts(ans ? "East" : "West");
	}
	return 0;
}
