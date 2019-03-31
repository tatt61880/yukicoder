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
	int ans = 0;
	int N;
	rep(i, 5){
		cin >> N;
		int temp = 0;
		if(N % 3 == 0) temp += 4;
		if(N % 5 == 0) temp += 4;
		if(temp == 0) temp += to_string(N).size();
		ans += temp;
	}
	printf("%d\n", ans);
	return 0;
}
