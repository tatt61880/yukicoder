//{{{
#include <bits/stdc++.h>
using namespace std;
#define rep(...) repN((__VA_ARGS__,rep3,rep2,loop,~))(__VA_ARGS__)
#define loop(n) rep2(_loop_,n)
#define rep2(i,n) rep3(i,0,n)
#define rep3(i,begin,end) for(int i=(int)(begin),i##_end=(int)(end);i<i##_end;++i)
#define repN(a) repX a
#define repX(a0,a1,a2,x,...) x
//}}}

int main(void){
	string S;
	cin >> S;
	int t = 0;
	int r = 0;
	int e = 0;
	rep(i, S.size()){
		if(S[i] == 't') t++;
		if(S[i] == 'r') r++;
		if(S[i] == 'e') e++;
	}
	int ans = 1000000;
	ans = min(t, ans);
	ans = min(r, ans);
	ans = min(e / 2, ans);
	printf("%d\n", ans);
	return 0;
}
