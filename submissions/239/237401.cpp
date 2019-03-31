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

int a[100];
int main(){
	int N;
	cin >> N;
	rep(i, N){
		rep(j, N){
			string s;
			cin >> s;
			a[j] += (s == "nyanpass");
		}
	}
	rep(i, N) a[i] -= N - 1;
	int count = 0;
	int ans;
	rep(i, N) if(!a[i]) count++, ans = i + 1;
	if(count == 1){
		printf("%d\n", ans);
	}else{
		puts("-1");
	}
	return 0;
}
