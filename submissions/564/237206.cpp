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

string f(int n){
	if(n % 10 == 1) return "st";
	if(n % 10 == 2) return "nd";
	if(n % 10 == 3) return "rd";
	return "th";
}

int main(){
	int H, N;
	cin >> H >> N;
	int ans = 1;
	rep(i, N - 1){
		int h;
		cin >> h;
		if(h > H) ans++;
	}
	printf("%d%s\n", ans, f(ans).c_str());
	return 0;
}
